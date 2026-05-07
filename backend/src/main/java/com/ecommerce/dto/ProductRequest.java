package com.ecommerce.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    @NotBlank private String name;
    private String description;
    @NotNull @Positive private BigDecimal price;
    private BigDecimal discountPrice;
    @NotNull @Min(0) private Integer stockQuantity;
    private String sku;
    @NotNull private Long categoryId;
    private String brand;
    private boolean featured;
    private List<String> tags;
    private Double weight;
    private String dimensions;
}
