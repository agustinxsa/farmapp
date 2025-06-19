package com.saltoit.farmapp.domain;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Turn {
   private Long id;
   private String code;
   private TurnStatus status;
   private LocalDateTime createdAt;
   private LocalDateTime calledAt;
   private LocalDateTime attendedAt;
}
