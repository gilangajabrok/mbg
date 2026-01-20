package com.mbg.service;

import com.mbg.dto.BranchDTO;
import com.mbg.dto.CreateBranchRequest;
import com.mbg.entity.Branch;
import com.mbg.entity.Organization;
import com.mbg.entity.User;
import com.mbg.exception.MbgException;
import com.mbg.repository.BranchRepository;
import com.mbg.repository.OrganizationRepository;
import com.mbg.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BranchService {

    private final BranchRepository branchRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    @Transactional
    public BranchDTO createBranch(UUID organizationId, CreateBranchRequest request) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> MbgException.notFound("Organization"));

        // Check branch limit
        long currentBranches = branchRepository.countByOrganizationId(organizationId);
        if (currentBranches >= organization.getMaxBranches()) {
            throw MbgException.badRequest("Maximum branch limit reached for this organization");
        }

        // Check code uniqueness within organization
        if (branchRepository.findByOrganizationIdAndCode(organizationId, request.getCode()).isPresent()) {
            throw MbgException.conflict("Branch code already exists in this organization");
        }

        Branch branch = Branch.builder()
                .organizationId(organizationId)
                .name(request.getName())
                .code(request.getCode())
                .address(request.getAddress())
                .city(request.getCity())
                .phone(request.getPhone())
                .email(request.getEmail())
                .isActive(true)
                .isHeadquarters(request.getIsHeadquarters() != null ? request.getIsHeadquarters() : false)
                .managerId(request.getManagerId())
                .build();

        branch = branchRepository.save(branch);
        log.info("Branch created: {} for organization: {}", branch.getName(), organizationId);

        auditService.log("BRANCH_CREATE", "BRANCH", branch.getId(),
                "Branch created: " + branch.getName());

        return mapToDTO(branch);
    }

    public List<BranchDTO> getBranchesByOrganization(UUID organizationId) {
        return branchRepository.findByOrganizationId(organizationId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public BranchDTO getBranchById(UUID branchId) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> MbgException.notFound("Branch"));
        return mapToDTO(branch);
    }

    @Transactional
    public BranchDTO updateBranch(UUID branchId, CreateBranchRequest request) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> MbgException.notFound("Branch"));

        branch.setName(request.getName());
        branch.setAddress(request.getAddress());
        branch.setCity(request.getCity());
        branch.setPhone(request.getPhone());
        branch.setEmail(request.getEmail());
        branch.setManagerId(request.getManagerId());

        if (request.getIsHeadquarters() != null) {
            branch.setIsHeadquarters(request.getIsHeadquarters());
        }

        branch = branchRepository.save(branch);
        log.info("Branch updated: {}", branch.getName());

        auditService.log("BRANCH_UPDATE", "BRANCH", branch.getId(),
                "Branch updated: " + branch.getName());

        return mapToDTO(branch);
    }

    @Transactional
    public void deleteBranch(UUID branchId) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> MbgException.notFound("Branch"));

        String name = branch.getName();
        branchRepository.delete(branch);

        log.info("Branch deleted: {}", name);
        auditService.log("BRANCH_DELETE", "BRANCH", branchId,
                "Branch deleted: " + name);
    }

    private BranchDTO mapToDTO(Branch branch) {
        String managerName = null;
        if (branch.getManagerId() != null) {
            managerName = userRepository.findById(branch.getManagerId())
                    .map(user -> user.getFirstName() + " " + user.getLastName())
                    .orElse(null);
        }

        return BranchDTO.builder()
                .id(branch.getId())
                .organizationId(branch.getOrganizationId())
                .name(branch.getName())
                .code(branch.getCode())
                .address(branch.getAddress())
                .city(branch.getCity())
                .phone(branch.getPhone())
                .email(branch.getEmail())
                .isActive(branch.getIsActive())
                .isHeadquarters(branch.getIsHeadquarters())
                .managerId(branch.getManagerId())
                .managerName(managerName)
                .build();
    }
}
