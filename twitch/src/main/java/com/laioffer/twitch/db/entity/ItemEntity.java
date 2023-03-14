package com.laioffer.twitch.db.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.laioffer.twitch.external.model.Clip;
import com.laioffer.twitch.external.model.Stream;
import com.laioffer.twitch.external.model.Video;
import com.laioffer.twitch.model.ItemType;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("items")
//this means this class matched to table "items"
// this class is going to be stored in the db
public record ItemEntity(
        //the default constructor
        @Id Long id,// this is the id generated in the db, the "id" means primary key
        @JsonProperty("twitch_id") String twitchId,// look at the constructor, the video.id() clip.id() and stream.id() are all considered as twitch_id
        String title,
        String url,
        @JsonProperty("thumbnail_url") String thumbnailUrl,
        @JsonProperty("broadcaster_name") String broadcasterName,
        @JsonProperty("game_id") String gameId,
        @JsonProperty("item_type")ItemType type
        ) {
    //three secondary constructors that can be used for creating ItemEntity from Videos, clips, and streams
    //all of them are stored as ItemEntity in db
    public ItemEntity(String gameId, Video video){
        this(null, video.id(), video.title(), video.url(), video.thumbnailUrl(), video.userName(), gameId, ItemType.VIDEO);
    }
    public ItemEntity(Clip clip) {
        this(null, clip.id(), clip.title(), clip.url(), clip.thumbnailUrl(), clip.broadcasterName(), clip.gameId(), ItemType.CLIP);
    }
    public ItemEntity(Stream stream) {
        this(null, stream.id(), stream.title(), null, stream.thumbnailUrl(), stream.userName(), stream.gameId(), ItemType.STREAM);
    }
}

