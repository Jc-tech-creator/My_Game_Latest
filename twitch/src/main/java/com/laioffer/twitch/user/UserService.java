package com.laioffer.twitch.user;

import com.laioffer.twitch.db.UserRepository;
import com.laioffer.twitch.db.entity.UserEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;


@Service
public class UserService {


    private final UserDetailsManager userDetailsManager;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;




    public UserService(UserDetailsManager userDetailsManager, PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.userDetailsManager = userDetailsManager;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }


    public void register(String username, String password, String firstName, String lastName) {
        UserDetails user = User.builder()  // this is the default UserDetail data Entity provided by Spring, it contains more info(authority) than general UserEntity
                .username(username)  // this format is fluent api
                .password(passwordEncoder.encode(password))
                .roles("USER")
                .build();
        userDetailsManager.createUser(user);
        userRepository.updateNameByUsername(username, firstName, lastName);
    }



    public UserEntity findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}

