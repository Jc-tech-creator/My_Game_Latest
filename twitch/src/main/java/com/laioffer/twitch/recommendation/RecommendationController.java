package com.laioffer.twitch.recommendation;

import com.laioffer.twitch.db.entity.UserEntity;
import com.laioffer.twitch.model.TypeGroupedItemList;
import com.laioffer.twitch.user.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RecommendationController {
    private final RecommendationService recommendationService;
    private final UserService userService;

    public RecommendationController(RecommendationService recommendationService, UserService userService) {
        this.recommendationService = recommendationService;
        this.userService = userService;
    }
    @GetMapping("/recommendation")
    public TypeGroupedItemList getRecommendation(@AuthenticationPrincipal User user){//@AuthenticationPrincipal means 提供当前已经登录的用户的Info, refer to UserService
        UserEntity userEntity = null;
        if(user != null){// means the guy is already registered
            userEntity = userService.findByUsername(user.getUsername());
            //transfer from user to userEntity at this step
        }
        //
        return recommendationService.recommendItems(userEntity);
        //call the service function
    }
}
