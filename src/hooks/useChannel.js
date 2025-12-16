import { fetchChannels } from "@/apis/publish";
import { useState, useEffect } from "react";

export function useChannel (){
  const [ channelsList, setChannelsList ] = useState([])
  useEffect(() => {
    // 获取文章列表
    const updateChannels = async () => {
      const res = await fetchChannels();
      setChannelsList(res.data.channels);
    }
    updateChannels()
  }, [])
  return {
    channelsList
  }
}
  
