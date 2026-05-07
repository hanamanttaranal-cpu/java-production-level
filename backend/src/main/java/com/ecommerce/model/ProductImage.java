package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "product_images")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductImage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "product_id")
    private Product product;
    private String imageUrl;
    private String publicId;
    private String altText;
    @Builder.Default private boolean isPrimary = false;
    private Integer displayOrder;
}
