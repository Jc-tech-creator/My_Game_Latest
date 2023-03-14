package com.laioffer.twitch.item;

import com.laioffer.twitch.external.TwitchService;
import com.laioffer.twitch.external.model.Clip;
import com.laioffer.twitch.external.model.Stream;
import com.laioffer.twitch.model.TypeGroupedItemList;
import com.laioffer.twitch.external.model.Video;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
//this annotation is a must, without this when other class do dependency injection, they can't find this class
public class ItemService {
    private static final int SEARCH_RESULT_SIZE = 20;
    private final TwitchService twitchService;

    public ItemService(TwitchService twitchService){// dependancy injection
        this.twitchService = twitchService;
    }

    @Cacheable("items")
    public TypeGroupedItemList getItems(String gameId){
        //the use case of this function: given a gameId, return the TypeGroupedItemList(gameId, streams, videos, clips)
        List<Video> videos = twitchService.getVideos(gameId, SEARCH_RESULT_SIZE);
        List<Clip> clips = twitchService.getClips(gameId, SEARCH_RESULT_SIZE);
        List<Stream> streams = twitchService.getStreams(List.of(gameId), SEARCH_RESULT_SIZE);
        return new TypeGroupedItemList(gameId, streams, videos, clips);
        //given a gameId, return the TypeGroupedItemList(gameId, streams, videos, clips) such collection
    }
}
//sample return result:

