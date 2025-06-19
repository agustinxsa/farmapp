package com.saltoit.farmapp.controller;

import com.saltoit.farmapp.model.Turn;
import com.saltoit.farmapp.service.TurnService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turns")
public class TurnController {
    private final TurnService turnService;

    public TurnController(TurnService turnService) {
        this.turnService = turnService;
    }

    @PostMapping
    public Turn createTurn() {
        return turnService.createTurn();
    }

    @GetMapping
    public List<Turn> getAllTurns() {
        return turnService.getAllTurns();
    }

    @PostMapping("/{id}/call")
    public ResponseEntity<Turn> callTurn(@PathVariable Long id) {
        return turnService.callTurn(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/skip")
    public ResponseEntity<Turn> skipTurn(@PathVariable Long id) {
        return turnService.skipTurn(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/attend")
    public ResponseEntity<Turn> attendTurn(@PathVariable Long id) {
        return turnService.attendTurn(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 