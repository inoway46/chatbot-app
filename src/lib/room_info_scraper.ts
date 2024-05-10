import axios from 'axios';
import { load } from 'cheerio';

const URL_FORMAT = "https://suumo.jp/chintai/";

const fetchRoomInfo = async (url: string) => {
  if (!url.includes(URL_FORMAT)) {
    throw new Error("Invalid URL");
  }

  console.log("fetching room info from url");

  const response = await axios.get(url);
  const $ = load(response.data);

  const rent = $(".property_view_note-emphasis").text();
  const layout = $(".property_view_table-body").eq(2).text();

  return { rent, layout };
};

const createRoomInfoMessage = async (url: string): Promise<string> => {
  const roomInfo = await fetchRoomInfo(url);
  const message = `賃料${roomInfo.rent}で間取り${roomInfo.layout}の物件がありました。詳細はこちら→${url}`;
  return message;
};

export default createRoomInfoMessage;
