package com.ecommerce.config;

import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping initialization.");
            return;
        }

        log.info("Seeding database with sample data...");

        // Admin user
        User admin = User.builder()
            .firstName("Admin")
            .lastName("User")
            .email("admin@shopnow.com")
            .password(passwordEncoder.encode("admin123"))
            .role(User.Role.ADMIN)
            .emailVerified(true)
            .build();
        userRepository.save(admin);

        // Sample customer
        User customer = User.builder()
            .firstName("John")
            .lastName("Doe")
            .email("john@example.com")
            .password(passwordEncoder.encode("password123"))
            .role(User.Role.CUSTOMER)
            .emailVerified(true)
            .build();
        userRepository.save(customer);

        // Categories
        Category electronics = categoryRepository.save(Category.builder()
            .name("Electronics").slug("electronics")
            .description("Gadgets and electronic devices").active(true).build());

        Category fashion = categoryRepository.save(Category.builder()
            .name("Fashion").slug("fashion")
            .description("Clothing, shoes, and accessories").active(true).build());

        Category home = categoryRepository.save(Category.builder()
            .name("Home & Garden").slug("home")
            .description("Furniture, decor, and garden supplies").active(true).build());

        Category books = categoryRepository.save(Category.builder()
            .name("Books").slug("books")
            .description("Books, eBooks, and educational materials").active(true).build());

        // Sample Products
        List<Product> products = List.of(
            Product.builder().name("iPhone 15 Pro").brand("Apple")
                .description("The latest iPhone with titanium design and A17 Pro chip. Features 48MP camera system, USB-C connectivity, and Action Button.")
                .price(new BigDecimal("134900")).discountPrice(new BigDecimal("129900"))
                .stockQuantity(50).category(electronics).featured(true).status(Product.ProductStatus.INACTIVE)
                .tags(List.of("smartphone", "apple", "5g")).build(),

            Product.builder().name("Samsung Galaxy S24 Ultra").brand("Samsung")
                .description("Samsung's flagship with S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor.")
                .price(new BigDecimal("124999")).discountPrice(new BigDecimal("114999"))
                .stockQuantity(35).category(electronics).featured(true).status(Product.ProductStatus.ACTIVE)
                .tags(List.of("smartphone", "samsung", "android")).build(),

            Product.builder().name("Sony WH-1000XM5").brand("Sony")
                .description("Industry-leading noise cancelling wireless headphones with exceptional sound quality and 30-hour battery life.")
                .price(new BigDecimal("29990")).discountPrice(new BigDecimal("24990"))
                .stockQuantity(100).category(electronics).featured(true).status(Product.ProductStatus.ACTIVE)
                .tags(List.of("headphones", "sony", "wireless")).build(),

            Product.builder().name("MacBook Air M3").brand("Apple")
                .description("Supercharged by M3 chip. Incredible performance, all-day battery life, and a stunning Liquid Retina display.")
                .price(new BigDecimal("114900"))
                .stockQuantity(25).category(electronics).featured(true).status(Product.ProductStatus.INACTIVE)
                .tags(List.of("laptop", "apple", "m3")).build(),

            Product.builder().name("Classic Fit Oxford Shirt").brand("Allen Solly")
                .description("Premium cotton oxford shirt perfect for office and casual wear. Available in multiple colors.")
                .price(new BigDecimal("2499")).discountPrice(new BigDecimal("1799"))
                .stockQuantity(200).category(fashion).featured(false).status(Product.ProductStatus.ACTIVE)
                .tags(List.of("shirt", "formal", "cotton")).build(),

            Product.builder().name("Levi's 511 Slim Jeans").brand("Levi's")
                .description("The iconic slim fit jean. Made with stretch fabric for all-day comfort. Classic 5-pocket styling.")
                .price(new BigDecimal("3999")).discountPrice(new BigDecimal("2999"))
                .stockQuantity(150).category(fashion).featured(false).status(Product.ProductStatus.ACTIVE)
                .tags(List.of("jeans", "denim", "slim-fit")).build(),

            Product.builder().name("Ergonomic Office Chair").brand("Green Soul")
                .description("High-back mesh chair with lumbar support, adjustable armrests, and breathable mesh back for long working hours.")
                .price(new BigDecimal("18999")).discountPrice(new BigDecimal("14999"))
                .stockQuantity(40).category(home).featured(true).status(Product.ProductStatus.ACTIVE)
                .tags(List.of("chair", "office", "ergonomic")).build(),

            Product.builder().name("Atomic Habits").brand("Penguin Random House")
                .description("By James Clear. An easy and proven way to build good habits and break bad ones. #1 NYT Bestseller.")
                .price(new BigDecimal("799")).discountPrice(new BigDecimal("499"))
                .stockQuantity(500).category(books).featured(false).status(Product.ProductStatus.INACTIVE)
                .tags(List.of("self-help", "productivity", "bestseller")).build()
        );

        productRepository.saveAll(products);
        log.info("✅ Database seeded with {} products, {} categories, 2 users.", products.size(), 4);
        log.info("Admin login: admin@shopnow.com / admin123");
        log.info("User login: john@example.com / password123");
    }
}
