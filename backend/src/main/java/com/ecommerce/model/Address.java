package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "addresses")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Address {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id")
    private User user;
    private String fullName;
    private String phone;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    @Builder.Default private boolean isDefault = false;
    @Enumerated(EnumType.STRING) private AddressType type;
    public enum AddressType { HOME, WORK, OTHER }
}
