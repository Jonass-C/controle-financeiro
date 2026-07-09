package br.edu.ufop.controlefinanceiro.security;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenDenyListService {

    private final Map<String, Instant> denylist = new ConcurrentHashMap<>();

    public void revogarToken(String token, Instant dataExpiracao) {
        if (token != null && !token.isBlank() && dataExpiracao != null) {
            limparTokensVencidos();
            denylist.put(token.trim(), dataExpiracao);
        }
    }

    public boolean isRevogado(String token) {
        if (token == null || token.isBlank()) return false;
        return denylist.containsKey(token.trim());
    }

    private void limparTokensVencidos() {
        Instant agora = Instant.now();
        denylist.entrySet().removeIf(entry -> entry.getValue().isBefore(agora));
    }
}
