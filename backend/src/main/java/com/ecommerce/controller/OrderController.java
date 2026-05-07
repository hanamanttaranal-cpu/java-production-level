package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.model.Order;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDTO>> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long addressId,
            @RequestParam String paymentMethod) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Order placed", orderService.createOrder(userId, addressId, paymentMethod)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getUserOrders(getUserId(userDetails), page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(id)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderDTO>> updateStatus(@PathVariable Long id,
                                                               @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", orderService.updateOrderStatus(id, status)));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).map(User::getId).orElseThrow();
    }
}
