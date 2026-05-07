package com.ecommerce.service;

import com.ecommerce.dto.OrderDTO;
import com.ecommerce.dto.OrderItemDTO;
import com.ecommerce.dto.AddressDTO;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    public OrderDTO createOrder(Long userId, Long addressId, String paymentMethod) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) throw new BadRequestException("Cart is empty");

        Address address = user.getAddresses().stream()
                .filter(a -> a.getId().equals(addressId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));

        BigDecimal subtotal = cart.getTotalAmount();
        BigDecimal shipping = subtotal.compareTo(new BigDecimal("500")) >= 0 ? BigDecimal.ZERO : new BigDecimal("50");
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.18"));
        BigDecimal total = subtotal.add(shipping).add(tax);

        Order order = Order.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(user)
                .shippingAddress(address)
                .paymentMethod(paymentMethod)
                .subtotal(subtotal)
                .shippingCost(shipping)
                .tax(tax)
                .totalAmount(total)
                .estimatedDelivery(LocalDateTime.now().plusDays(7))
                .build();

        List<OrderItem> items = cart.getItems().stream().map(ci -> {
            Product p = ci.getProduct();
            if (p.getStockQuantity() < ci.getQuantity())
                throw new BadRequestException("Insufficient stock for: " + p.getName());
            p.setStockQuantity(p.getStockQuantity() - ci.getQuantity());
            productRepository.save(p);
            return OrderItem.builder()
                    .order(order).product(p).quantity(ci.getQuantity())
                    .price(p.getPrice())
                    .totalPrice(p.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                    .build();
        }).collect(Collectors.toList());

        order.setItems(items);
        Order saved = orderRepository.save(order);
        cart.getItems().clear();
        cartRepository.save(cart);
        return mapToDTO(saved);
    }

    public Page<OrderDTO> getUserOrders(Long userId, int page, int size) {
        return orderRepository.findByUserId(userId, PageRequest.of(page, size)).map(this::mapToDTO);
    }

    public OrderDTO getOrderById(Long id) {
        return mapToDTO(orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id)));
    }

    public OrderDTO updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        order.setStatus(status);
        return mapToDTO(orderRepository.save(order));
    }

    private OrderDTO mapToDTO(Order order) {
        OrderDTO dto = modelMapper.map(order, OrderDTO.class);
        dto.setItems(order.getItems().stream().map(item -> {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setId(item.getId());
            itemDTO.setProductId(item.getProduct().getId());
            itemDTO.setProductName(item.getProduct().getName());
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setPrice(item.getPrice());
            itemDTO.setTotalPrice(item.getTotalPrice());
            return itemDTO;
        }).collect(Collectors.toList()));
        if (order.getShippingAddress() != null) {
            dto.setShippingAddress(modelMapper.map(order.getShippingAddress(), AddressDTO.class));
        }
        return dto;
    }
}
