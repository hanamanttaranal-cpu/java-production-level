package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<CartDTO>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success(cartService.getCart(userId)));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartDTO>> addToCart(@AuthenticationPrincipal UserDetails userDetails,
                                                           @RequestParam Long productId,
                                                           @RequestParam(defaultValue = "1") Integer quantity) {
        return ResponseEntity.ok(ApiResponse.success(cartService.addToCart(getUserId(userDetails), productId, quantity)));
    }

    @PutMapping("/item/{itemId}")
    public ResponseEntity<ApiResponse<CartDTO>> updateItem(@AuthenticationPrincipal UserDetails userDetails,
                                                            @PathVariable Long itemId,
                                                            @RequestParam Integer quantity) {
        return ResponseEntity.ok(ApiResponse.success(cartService.updateCartItem(getUserId(userDetails), itemId, quantity)));
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<ApiResponse<CartDTO>> removeItem(@AuthenticationPrincipal UserDetails userDetails,
                                                            @PathVariable Long itemId) {
        return ResponseEntity.ok(ApiResponse.success(cartService.removeFromCart(getUserId(userDetails), itemId)));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(getUserId(userDetails));
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).map(User::getId).orElseThrow();
    }
}
