
package com.raviteja.ardenial.service;

import com.raviteja.ardenial.model.Claim;
import com.raviteja.ardenial.repository.ClaimRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;

    public ClaimService(ClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    public List<Map<String, Object>> getPayerAnalytics() {
        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : claimRepository.getDeniedAmountByPayer()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("payer", row[0]);
            item.put("totalDeniedAmount", row[1]);
            item.put("deniedClaimCount", row[2]);
            result.add(item);
        }

        return result;
    }

    public List<Map<String, Object>> getReasonAnalytics() {
        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : claimRepository.getDeniedAmountByReason()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("denialReason", row[0]);
            item.put("totalDeniedAmount", row[1]);
            result.add(item);
        }

        return result;
    }

    public Page<Claim> getDeniedClaims(
            String payer,
            String reason,
            LocalDate startDate,
            LocalDate endDate,
            int page,
            int size) {

        if (page < 0 || size < 1 || size > 100) {
            throw new IllegalArgumentException(
                    "Page must be non-negative and size must be between 1 and 100");
        }

        if (startDate != null && endDate != null
                && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException(
                    "Start date cannot be after end date");
        }

        Pageable pageable = PageRequest.of(page, size);

        return claimRepository.searchDeniedClaims(
                payer, reason, startDate, endDate, pageable);
    }
}
