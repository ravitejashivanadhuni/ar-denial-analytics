
package com.raviteja.ardenial.controller;

import com.raviteja.ardenial.model.Claim;
import com.raviteja.ardenial.service.ClaimService;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @GetMapping("/analytics/payers")
    public List<Map<String, Object>> getPayerAnalytics() {
        return claimService.getPayerAnalytics();
    }

    @GetMapping("/analytics/reasons")
    public List<Map<String, Object>> getReasonAnalytics() {
        return claimService.getReasonAnalytics();
    }

    @GetMapping("/claims")
    public Page<Claim> getDeniedClaims(
            @RequestParam(required = false) String payer,
            @RequestParam(required = false) String reason,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return claimService.getDeniedClaims(
                payer, reason, startDate, endDate, page, size);
    }
}
