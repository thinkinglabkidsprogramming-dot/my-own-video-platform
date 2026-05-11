import { describe, expect, it } from "vitest";
import { extractYoutubeId } from "./youtube";

describe("extractYoutubeId", () => {
  it("youtube.com/watch?v= 形式のURLから動画IDを抽出する", () => {
    expect(extractYoutubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("youtu.be/ 短縮URL形式から動画IDを抽出する", () => {
    expect(extractYoutubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("11文字の動画IDをそのまま返す", () => {
    expect(extractYoutubeId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("クエリパラメータが複数あるURLでも正しく抽出する", () => {
    expect(extractYoutubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s")).toBe("dQw4w9WgXcQ");
  });

  it("マッチしない文字列はそのまま返す", () => {
    expect(extractYoutubeId("not-a-valid-url")).toBe("not-a-valid-url");
  });

  it("アンダースコアやハイフンを含む動画IDを正しく抽出する", () => {
    expect(extractYoutubeId("https://youtu.be/abc_def-GHIJ")).toBe("abc_def-GHIJ");
  });
});
