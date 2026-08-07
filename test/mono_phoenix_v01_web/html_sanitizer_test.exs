defmodule MonoPhoenixV01Web.HtmlSanitizerTest do
  use ExUnit.Case, async: true

  alias MonoPhoenixV01Web.HtmlSanitizer

  describe "sanitize_body/1" do
    test "preserves allow-listed formatting tags" do
      body = "You are three men of sin,<br>\r\n  whom Destiny<b>that</b> hath <i>to</i> instrument"
      assert HtmlSanitizer.sanitize_body(body) == body
    end

    test "preserves p, em and strong tags and their attributes" do
      body = ~s(<p class="line"><em>soft</em> and <strong>loud</strong></p>)
      assert HtmlSanitizer.sanitize_body(body) == body
    end

    test "escapes a stray < that does not open a valid tag" do
      # This is the crash case: an unterminated tag followed by prose let the
      # browser tokenize the trailing text into an attribute named `know<`.
      assert HtmlSanitizer.sanitize_body("I know< you are") == "I know&lt; you are"
    end

    test "escapes a bare < used as a comparison or emoticon" do
      assert HtmlSanitizer.sanitize_body("a < b <3") == "a &lt; b &lt;3"
    end

    test "neutralises tags that are not on the allow-list" do
      assert HtmlSanitizer.sanitize_body("<script>alert(1)</script>") ==
               "&lt;script>alert(1)&lt;/script>"
    end

    test "leaves entities and non-tag content untouched" do
      body = "whom Destiny&nbsp;that hath&hellip;"
      assert HtmlSanitizer.sanitize_body(body) == body
    end

    test "nil becomes an empty string" do
      assert HtmlSanitizer.sanitize_body(nil) == ""
    end
  end
end
