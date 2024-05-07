import puppeteer from "puppeteer";

const URL_FORMAT = "https://suumo.jp/chintai/";

const fetchRoomInfo = async (url: string) => {
  if (!url.includes(URL_FORMAT)) {
    throw new Error("Invalid URL");
  }

  console.log("fetching room info from url")

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const roomInfo = await page.evaluate(() => {
    const rent = document.querySelector(
      ".property_view_note-emphasis"
    )?.textContent;
    const layout = document.querySelectorAll(".property_view_table-body")[2]
      ?.textContent;
    return { rent, layout };
  });

  await browser.close();
  return roomInfo;
};

const createRoomInfoMessage = async (url: string): Promise<string> => {
  try {
    const roomInfo = await fetchRoomInfo(url);
    const message = `賃料${roomInfo.rent}で間取り${roomInfo.layout}の物件がありました。詳細はこちら→${url}`;
    return message;
  } catch (error) {
    throw error;
  }
};

export default createRoomInfoMessage;
