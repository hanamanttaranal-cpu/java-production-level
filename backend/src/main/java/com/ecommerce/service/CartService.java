package com.ecommerce.service;

import com.ecommerce.dto.CartDTO;
import com.ecommerce.dto.CartItemDTO;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartDTO getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return mapToDTO(cart);
    }

    public CartDTO addToCart(Long userId, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (product.getStockQuantity() < quantity) {
            throw new BadRequestException("Insufficient stock");
        }

        CartItem existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst().orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
        } else {
            CartItem item = CartItem.builder().cart(cart).product(product).quantity(quantity).build();
            cart.getItems().add(item);
        }
        return mapToDTO(cartRepository.save(cart));
    }

    public CartDTO updateCartItem(Long userId, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", "id", itemId));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            item.setQuantity(quantity);
        }
        return mapToDTO(cartRepository.save(cart));
    }

    public CartDTO removeFromCart(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return mapToDTO(cartRepository.save(cart));
    }

    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            Cart cart = Cart.builder().user(user).build();
            return cartRepository.save(cart);
        });
    }

    private CartDTO mapToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        dto.setItems(cart.getItems().stream().map(item -> {
            CartItemDTO itemDTO = new CartItemDTO();
            itemDTO.setId(item.getId());
            itemDTO.setProductId(item.getProduct().getId());
            itemDTO.setProductName(item.getProduct().getName());
            itemDTO.setPrice(item.getProduct().getPrice());
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setTotalPrice(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            if (!item.getProduct().getImages().isEmpty()) {
                itemDTO.setProductImage(item.getProduct().getImages().get(0).getImageUrl());
            }
            return itemDTO;
        }).collect(Collectors.toList()));
        dto.setTotalAmount(cart.getTotalAmount());
        dto.setTotalItems(cart.getItems().stream().mapToInt(CartItem::getQuantity).sum());
        return dto;
    }
}
