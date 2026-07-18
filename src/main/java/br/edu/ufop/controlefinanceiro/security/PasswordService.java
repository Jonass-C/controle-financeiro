package br.edu.ufop.controlefinanceiro.security;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.HexFormat;

@Service
public class PasswordService {

    private static final String ALGORITMO = "PBKDF2WithHmacSHA256";
    private static final int ITERACOES = 600000;
    private static final int TAMANHO_CHAVE = 256;

    public String gerarSalt() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] salt = new byte[16];
        secureRandom.nextBytes(salt);
        return HexFormat.of().formatHex(salt);
    }

    public String hashSenha(String senhaPura, String hexSalt) {
        try {
            byte[] salt = HexFormat.of().parseHex(hexSalt);
            char[] caracteresSenha = senhaPura.toCharArray();

            PBEKeySpec keySpec = new  PBEKeySpec(caracteresSenha, salt, ITERACOES, TAMANHO_CHAVE);
            SecretKeyFactory secretKeyFactory = SecretKeyFactory.getInstance(ALGORITMO);

            byte[] hashSenha = secretKeyFactory.generateSecret(keySpec).getEncoded();
            return HexFormat.of().formatHex(hashSenha);

        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new IllegalStateException("Erro interno de criptografia.", e);
        }
    }

    public boolean verificarSenha(String senhaDigitada, String dbHash, String dbSalt) {
        String novoHash = hashSenha(senhaDigitada, dbSalt);
        byte[] novoHashByte = HexFormat.of().parseHex(novoHash);
        byte[] dbHashByte = HexFormat.of().parseHex(dbHash);

        return java.security.MessageDigest.isEqual(dbHashByte, novoHashByte);
    }
}
