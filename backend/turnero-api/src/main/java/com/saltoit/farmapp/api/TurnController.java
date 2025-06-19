package com.saltoit.farmapp.api;

import com.saltoit.farmapp.application.TurnService;
import com.saltoit.farmapp.domain.Turn;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turns")
public class TurnController {

   private final TurnService turnService;

   public TurnController() {
      // Inyectamos directamente (luego cambiamos esto por @Autowired o @Bean si se externaliza)
      this.turnService = new TurnService();
   }

   @PostMapping
   public Turn createTurn() {
      return turnService.createTurn();
   }

   @GetMapping("/pending")
   public List<Turn> getPendingTurns() {
      return turnService.getPendingTurns();
   }

   @PatchMapping("/{id}/call")
   public Turn callTurn(@PathVariable("id") Long id) {
      return turnService.callTurn(id).orElseThrow();
   }

   @PatchMapping("/{id}/skip")
   public Turn skipTurn(@PathVariable("id") Long id) {
      return turnService.skipTurn(id).orElseThrow();
   }

   @PatchMapping("/{id}/attend")
   public Turn attendTurn(@PathVariable("id") Long id) {
      return turnService.attendTurn(id).orElseThrow();
   }
}
