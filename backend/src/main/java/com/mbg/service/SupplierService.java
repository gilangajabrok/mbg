package com.mbg.service;

import com.mbg.entity.Supplier;
import com.mbg.repository.SupplierRepository;
import com.mbg.config.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SupplierService {

    private final SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public Page<Supplier> getAllSuppliers(Pageable pageable) {
        UUID organizationId = TenantContext.getTenantId();
        UUID branchId = TenantContext.getBranchId();

        if (branchId != null) {
            return supplierRepository.findByOrganizationIdAndBranchId(organizationId, branchId, pageable);
        } else {
            return supplierRepository.findByOrganizationId(organizationId, pageable);
        }
    }

    @Transactional(readOnly = true)
    public Supplier getSupplierById(UUID id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found with id: " + id));
    }

    public Supplier createSupplier(Supplier supplier) {
        if (supplier.getOrganizationId() == null) {
            supplier.setOrganizationId(TenantContext.getTenantId());
        }
        if (supplier.getBranchId() == null) {
            supplier.setBranchId(TenantContext.getBranchId());
        }
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(UUID id, Supplier details) {
        Supplier supplier = getSupplierById(id);
        
        supplier.setName(details.getName());
        supplier.setAddress(details.getAddress());
        supplier.setContactPerson(details.getContactPerson());
        supplier.setPhone(details.getPhone());
        supplier.setEmail(details.getEmail());
        supplier.setCategory(details.getCategory());
        
        return supplierRepository.save(supplier);
    }

    public void deleteSupplier(UUID id) {
        Supplier supplier = getSupplierById(id);
        supplierRepository.delete(supplier);
    }
}
