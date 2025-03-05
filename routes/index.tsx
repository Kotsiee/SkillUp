import CircleCrop from "../islands/image/imageAdjust.tsx";
import Test from "../islands/Test.tsx";

export default function Home() {
  return (
    <div class="home">
      <link rel="stylesheet" href="/styles/test.css" />
      <Test />

      <div class="coloursTest colours">
        <div id="col-1"></div>
        <div id="col-2"></div>
        <div id="col-3"></div>
      </div>

      <div class="coloursTest colours-dark">
        <div id="col-1"></div>
        <div id="col-2"></div>
        <div id="col-3"></div>
      </div>

      <div class="coloursTest colours-darker">
        <div id="col-1"></div>
        <div id="col-2"></div>
        <div id="col-3"></div>
      </div>

      <div class="coloursTest colours-light">
        <div id="col-1"></div>
        <div id="col-2"></div>
        <div id="col-3"></div>
      </div>

      <div class="coloursTest colours-lighter">
        <div id="col-1"></div>
        <div id="col-2"></div>
        <div id="col-3"></div>
      </div>

      <div class="coloursTest gradient">
        <div id="col-1"></div>
        <div id="col-2"></div>
        <div id="col-3"></div>
      </div>

      <div class="coloursTest background">
        <div id="col-1"></div>
        <div id="col-2"></div>
        <div id="col-3"></div>
      </div>

      <div class="headers">
        <h1>Header 1</h1>
        <h2>Header 2</h2>
        <h3>Header 3</h3>
        <h4>Header 4</h4>
        <h5>Header 5</h5>
        <h6>Header 6</h6>
      </div>

      <div>
        <p>Paragraph</p>
        <a href="#">Link</a> <br/>
        <b>Bold</b> <br/>
        <i>Italic</i> <br/>
        <u>Underline</u> <br/>
      </div>

      <div class="list">
        <ul>
          <li>Unorderded List 1</li>
          <li>Unorderded List 2</li>
          <li>Unorderded List 3</li>
        </ul>

        <ol>
          <li>Orderded List 1</li>
          <li>Orderded List 2</li>
          <li>Orderded List 3</li>
        </ol>
      </div>

      <div class="inputs">
        <input type="button"/> <br/>
        <input type="checkbox"/> <br/>
        <input type="color"/> <br/>
        <input type="date"/> <br/>
        <input type="datetime-local"/> <br/>
        <input type="email"/> <br/>
        <input type="file"/> <br/>
        <input type="hidden"/> <br/>
        <input type="image"/> <br/>
        <input type="month"/> <br/>
        <input type="number"/> <br/>
        <input type="password"/> <br/>
        <input type="radio"/> <br/>
        <input type="range"/> <br/>
        <input type="reset"/> <br/>
        <input type="search"/> <br/>
        <input type="submit"/> <br/>
        <input type="tel"/> <br/>
        <input type="text"/> <br/>
        <input type="time"/> <br/>
        <input type="url"/> <br/>
        <input type="week"/> <br/>
      </div>
    </div>
  );
}
