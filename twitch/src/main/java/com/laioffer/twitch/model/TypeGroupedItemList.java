package com.laioffer.twitch.model;

import com.laioffer.twitch.db.entity.ItemEntity;
import com.laioffer.twitch.external.model.Clip;
import com.laioffer.twitch.external.model.Stream;
import com.laioffer.twitch.external.model.Video;
import com.laioffer.twitch.model.ItemType;

import java.util.ArrayList;
import java.util.List;

public record TypeGroupedItemList(
        List<ItemEntity> streams,
        List<ItemEntity> videos,
        List<ItemEntity> clips
) {
    //the below are two constructor, they have different use case, but the return type are the same
    public TypeGroupedItemList(List<ItemEntity> items){
        this(
                //I think the reason we do this is that the input List<ItemEntity> items composed of all types of Items
                // so we need to do filtering
                filterForType(items, ItemType.STREAM),
                filterForType(items, ItemType.VIDEO),
                filterForType(items, ItemType.CLIP)
        );
    }
    public TypeGroupedItemList(String gameId, List<Stream> streams, List<Video> videos, List<Clip> clips){
        this(
                fromStreams(streams),
                fromVideos(gameId, videos),
                fromClips(clips)
        );

    }

    private static List<ItemEntity> filterForType(List<ItemEntity> items, ItemType type){
        //this is to filter ItemEntity list by ItemType
        List<ItemEntity> filtered = new ArrayList<>();
        for(ItemEntity item : items){
            if(item.type() == type){
                filtered.add(item);
            }
        }
        return filtered;
    }
    private static List<ItemEntity> fromStreams(List<Stream> streams){
        //those from*** function is to convert List<xxx> to List<ItemType> (Generic type)
        List<ItemEntity> items = new ArrayList<>();
        for(Stream stream : streams){
            items.add(new ItemEntity(stream));
        }
        return items;
    }

    private static List<ItemEntity> fromVideos(String gameId, List<Video> videos){
        List<ItemEntity> items = new ArrayList<>();
        for(Video video : videos){
            items.add(new ItemEntity(gameId, video));
        }
        return items;
    }

    private static List<ItemEntity> fromClips(List<Clip> clips){
        List<ItemEntity> items = new ArrayList<>();
        for(Clip clip : clips){
            items.add(new ItemEntity(clip));
        }
        return items;
    }


}
