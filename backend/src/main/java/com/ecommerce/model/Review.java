package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "reviews")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "product_id")
    private Product product;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id")
    private User user;
    private Integer rating;
    private String title;
    @Column(columnDefinition = "TEXT") private String comment;
    @Builder.Default private boolean verified = false;
    @Builder.Default private int helpfulCount = 0;
    @CreationTimestamp private LocalDateTime createdAt;
}
