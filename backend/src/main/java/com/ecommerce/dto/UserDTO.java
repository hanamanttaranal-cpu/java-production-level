package com.ecommerce.dto;

import com.ecommerce.model.User;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String profileImage;
    private User.Role role;
    private boolean emailVerified;
}
