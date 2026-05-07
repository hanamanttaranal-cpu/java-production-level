package com.ecommerce.service;

import com.ecommerce.dto.ProductDTO;
import com.ecommerce.dto.ProductRequest;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    public Page<ProductDTO> getAllProducts(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.findByStatus(Product.ProductStatus.ACTIVE, pageable)
                .map(this::mapToDTO);
    }

    // Admin: get ALL products regardless of status
    public Page<ProductDTO> getAllProductsAdmin(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.findAll(pageable).map(this::mapToDTO);
    }

    // Admin: approve (set ACTIVE) or deactivate (set INACTIVE)
    public ProductDTO updateProductStatus(Long id, Product.ProductStatus status) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setStatus(status);
        return mapToDTO(productRepository.save(product));
    }

    public Page<ProductDTO> searchProducts(String name, Long categoryId, BigDecimal minPrice,
                                            BigDecimal maxPrice, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.searchProducts(name, categoryId, minPrice, maxPrice, pageable)
                .map(this::mapToDTO);
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToDTO(product);
    }

    public List<ProductDTO> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ProductDTO createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .stockQuantity(request.getStockQuantity())
                .sku(request.getSku())
                .category(category)
                .brand(request.getBrand())
                .featured(request.isFeatured())
                .tags(request.getTags())
                .weight(request.getWeight())
                .dimensions(request.getDimensions())
                .build();

        return mapToDTO(productRepository.save(product));
    }

    public ProductDTO updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            product.setCategory(category);
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setBrand(request.getBrand());
        product.setFeatured(request.isFeatured());
        product.setTags(request.getTags());

        return mapToDTO(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", "id", id);
        }
        productRepository.deleteById(id);
    }

    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = modelMapper.map(product, ProductDTO.class);
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        dto.setImageUrls(product.getImages().stream()
                .map(img -> img.getImageUrl())
                .collect(Collectors.toList()));
        return dto;
    }
}
