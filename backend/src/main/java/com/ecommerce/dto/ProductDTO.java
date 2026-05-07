package com.ecommerce.dto;

import com.ecommerce.model.Product;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stockQuantity;
    private String sku;
    private Long categoryId;
    private String categoryName;
    private List<String> imageUrls;
    private Double averageRating;
    private Integer totalReviews;
    private Product.ProductStatus status;
    private String brand;
    private boolean featured;
    private List<String> tags;
    private LocalDateTime createdAt;
}
