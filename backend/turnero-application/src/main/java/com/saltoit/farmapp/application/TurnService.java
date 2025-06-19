package com.saltoit.farmapp.application;

import com.saltoit.farmapp.domain.Turn;
import com.saltoit.farmapp.domain.TurnStatus;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class TurnService {

   @Getter
   private final List<Turn> turns = new ArrayList<>();
   private Long sequence = 1L;

   public Turn createTurn() {
      Turn turn = new Turn();
      turn.setId(sequence++);
      turn.setCode(generateCode(turn.getId()));
      turn.setStatus(TurnStatus.CREATED);
      turn.setCreatedAt(LocalDateTime.now());

      turns.add(turn);
      return turn;
   }

   public Optional<Turn> callTurn(Long id) {
      return updateTurnStatus(id, TurnStatus.CALLED, true);
   }

   public Optional<Turn> skipTurn(Long id) {
      return updateTurnStatus(id, TurnStatus.SKIPPED, false);
   }

   public Optional<Turn> attendTurn(Long id) {
      return updateTurnStatus(id, TurnStatus.ATTENDED, true);
   }

   private Optional<Turn> updateTurnStatus(Long id, TurnStatus newStatus, boolean setTimestamp) {
      return turns.stream()
              .filter(t -> t.getId().equals(id))
              .findFirst()
              .map(turn -> {
                 turn.setStatus(newStatus);
                 if (newStatus == TurnStatus.CALLED) {
                    turn.setCalledAt(LocalDateTime.now());
                 } else if (newStatus == TurnStatus.ATTENDED) {
                    turn.setAttendedAt(LocalDateTime.now());
                 }
                 return turn;
              });
   }

   private String generateCode(Long id) {
      return String.format("A%03d", id);
   }

   public List<Turn> getPendingTurns() {
      return turns.stream()
              .filter(t -> t.getStatus() == TurnStatus.CREATED)
              .toList();
   }
}
