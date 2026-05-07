package com.ecommerce.dto;

import com.ecommerce.model.Order;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private List<OrderItemDTO> items;
    private AddressDTO shippingAddress;
    private Order.OrderStatus status;
    private Order.PaymentStatus paymentStatus;
    private String paymentMethod;
    private BigDecimal subtotal;
    private BigDecimal shippingCost;
    private BigDecimal tax;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private String couponCode;
    private String trackingNumber;
    private LocalDateTime estimatedDelivery;
    private LocalDateTime createdAt;
}
