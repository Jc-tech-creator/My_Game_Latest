package com.laioffer.twitch.recommendation;

import com.laioffer.twitch.db.entity.ItemEntity;
import com.laioffer.twitch.db.entity.UserEntity;
import com.laioffer.twitch.external.TwitchService;
import com.laioffer.twitch.external.model.Clip;
import com.laioffer.twitch.external.model.Stream;
import com.laioffer.twitch.external.model.Video;
import com.laioffer.twitch.favorite.FavoriteService;
import com.laioffer.twitch.model.TypeGroupedItemList;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RecommendationService {
    //the basic logic of the recommendation is content based, find the gameIds of those favorite items of that users
    // and recommend those items(streams, video, clips) with the same gameids of those gameIds.
    //(you can consider gameids as a property of those liked items)

    private static final int MAX_GAME_SEED = 3;// only recommend 3 gameIds
    private static final int PER_PAGE_ITEM_SIZE = 20;// recommend 20 items in total

    private final TwitchService twitchService;
    private final FavoriteService favoriteService;

    public RecommendationService(TwitchService twitchService, FavoriteService favoriteService) {
        this.twitchService = twitchService;
        this.favoriteService = favoriteService;
    }

    @Cacheable("recommend_items") // add a cache to this methods call to increase speed
    public TypeGroupedItemList recommendItems(UserEntity userEntity) {
        List<String> gameIds; // initialize the list of unique gameIds
        Set<String> exclusions = new HashSet<>();// exclusion is a set of unique twitch_id
        if (userEntity == null) { //user没有登录
            gameIds = twitchService.getTopGameIds();
        } else {
            List<ItemEntity> items = favoriteService.getFavoriteItems(userEntity);// those items are the favorite items of that user
            if (items.isEmpty()) {// if no favorite items of that user, we return topGames
                gameIds = twitchService.getTopGameIds();
            } else {// if that user have favorite items
                Set<String> uniqueGameIds = new HashSet<>();// uniqueGameIds is a unique set of gameIds
                for (ItemEntity item : items) {
                    uniqueGameIds.add(item.gameId());
                    exclusions.add(item.twitchId());
                }
                gameIds = new ArrayList<>(uniqueGameIds);// unique list of GameIds
            }
        }
        int gameSize = Math.min(gameIds.size(), MAX_GAME_SEED);// make sure the game number is under 3
        int perGameListSize = PER_PAGE_ITEM_SIZE / gameSize; //balance each gameId, 每个游戏分配到的item数量
        // all those gameIds belonges to the set that is the favorite game of that users
        List<ItemEntity> streams = recommendStreams(gameIds, exclusions);
        List<ItemEntity> clips = recommendClips(gameIds.subList(0, gameSize), perGameListSize, exclusions);
        List<ItemEntity> videos = recommendVideos(gameIds.subList(0, gameSize), perGameListSize, exclusions);

        return new TypeGroupedItemList(streams, videos, clips);// gather three categories above
    }


    private List<ItemEntity> recommendStreams(List<String> gameIds, Set<String> exclusions) {// getStreams api is the only one that we don't limit by perGameListSize
        List<Stream> streams = twitchService.getStreams(gameIds, PER_PAGE_ITEM_SIZE);//getStreams(List<String> gameIds, int first)
        List<ItemEntity> resultItems = new ArrayList<>();// initialize the result item list
        for (Stream stream : streams) {
            if (!exclusions.contains(stream.id())) {// this is to make sure the recommended item is not favorited by the user before
                resultItems.add(new ItemEntity(stream));
            }
        }
        return resultItems;
    }

    private List<ItemEntity> recommendVideos(List<String> gameIds, int perGameListSize, Set<String> exclusions) {
        List<ItemEntity> resultItems = new ArrayList<>();
        for (String gameId : gameIds) {
            List<Video> listPerGame = twitchService.getVideos(gameId, perGameListSize);
            for (Video video : listPerGame) {
                if (!exclusions.contains(video.id())) {// this is to make sure the recommended item is not favorited by the user before
                    resultItems.add(new ItemEntity(gameId, video));
                }
            }
        }
        return resultItems;
    }
    private List<ItemEntity> recommendClips(List<String> gameIds, int perGameListSize, Set<String> exclusions) {
        List<ItemEntity> resultItems = new ArrayList<>();
        for (String gameId : gameIds) {
            List<Clip> listPerGame = twitchService.getClips(gameId, perGameListSize);
            for (Clip clip : listPerGame) {
                if (!exclusions.contains(clip.id())) {// this is to make sure the recommended item is not favorited by the user before
                    resultItems.add(new ItemEntity(clip));
                }
            }
        }
        return resultItems;
    }

}


