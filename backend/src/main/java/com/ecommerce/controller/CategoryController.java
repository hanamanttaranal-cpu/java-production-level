package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Category;
import com.ecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(categoryRepository.findByActiveTrue()));
    }

    @GetMapping("/root")
    public ResponseEntity<ApiResponse<List<Category>>> getRootCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryRepository.findByParentIsNull()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id))));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> create(@RequestBody Category category) {
        return ResponseEntity.ok(ApiResponse.success("Category created", categoryRepository.save(category)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> update(@PathVariable Long id, @RequestBody Category updated) {
        Category existing = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setImageUrl(updated.getImageUrl());
        existing.setSlug(updated.getSlug());
        existing.setActive(updated.isActive());
        return ResponseEntity.ok(ApiResponse.success("Category updated", categoryRepository.save(existing)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!categoryRepository.existsById(id))
            throw new ResourceNotFoundException("Category", "id", id);
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted", null));
    }
}
