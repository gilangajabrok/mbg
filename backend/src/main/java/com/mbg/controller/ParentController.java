package com.mbg.controller;

import com.mbg.entity.User;
import com.mbg.service.ParentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/parents")
@RequiredArgsConstructor
public class ParentController {

    private final ParentService parentService;

    @GetMapping
    public ResponseEntity<Page<User>> getAllParents(Pageable pageable) {
        return ResponseEntity.ok(parentService.getAllParents(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getParentById(@PathVariable UUID id) {
        return ResponseEntity.ok(parentService.getParentById(id));
    }

    @PostMapping
    public ResponseEntity<User> createParent(@RequestBody User parent) {
        // Tip: In real app use DTO to safe transfer password
        return ResponseEntity.ok(parentService.createParent(parent));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateParent(@PathVariable UUID id, @RequestBody User parent) {
        return ResponseEntity.ok(parentService.updateParent(id, parent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParent(@PathVariable UUID id) {
        parentService.deleteParent(id);
        return ResponseEntity.noContent().build();
    }
}
