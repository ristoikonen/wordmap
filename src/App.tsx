import { useState } from 'react'
//import React, { useState } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';

import { stopWords } from './assets/stopwords.fixture';
import './App.css'

// Pasted text shows up here!
export const sampleLyrics = `Pasted text showing here!`;
/* Got a wife and kids in Baltimore, Jack
I went out for a ride and I never went back
Like a river that don't know where it's flowing
I took a wrong turn and I just kept going
I met her in a Kingstown bar
We fell in love, I knew it had to end
We took what we had and we ripped it apart
Now here I am down in Kingstown again`;
 */
/*
interface ExampleProps {
  width: number;
  height: number;
  showControls?: boolean;
}
*/

//const filteredWords = totoAfricaLyrics.replace(word => !stopWords.includes(word),''); //.filter(word => !stopWords.includes(word)); //.has(word)
// : string[]
export interface WordData {
  text: string;
  value: number;
}

const colors = ['#143059', '#2F6B9A', '#82a6c2'];


function wordFreq(text: string): WordData[] {
  const words: string[] = text.replace(/\./g, '').split(/\s/);
  const freqMap: Record<string, number> = {};

  for (const w of words) {
    if (!freqMap[w]) freqMap[w] = 0;
    freqMap[w] += 1;
  }
  return Object.keys(freqMap).map((word) => ({ text: word, value: freqMap[word] }));
}

function getRotationDegree() {
  const rand = Math.random();
  const degree = rand > 0.5 ? 60 : -60;
  return rand * degree;
}


let words = wordFreq(sampleLyrics);
//words = words.filter((w) => !stopWords.toUpperCase().includes(w.text.toUpperCase())); // Filter out stop words

const fontScale = scaleLog({
  domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
  range: [20, 100],
});

//TODO" continue..
//function fontScaler(dx:WordData){   return fontScale(dx.value); // Use the fontScale to map values to font sizes }
const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

const fixedValueGenerator = () => 0.5;

type SpiralType = 'archimedean' | 'rectangular';


const showControls = false; // Set to true if you want to show controls
const width = 800;
const height = 600;

function App() {
  //const [count, setCount] = useState(0)
  const [spiralType, setSpiralType] = useState<SpiralType>('archimedean');
  const [withRotation, setWithRotation] = useState(false);
  const [pastedContent, setPastedContent] = useState('');
  const [wordDataArray, setWordDataArray] = useState<WordData[]>(words); // State to hold the word data array
  const [inputValue, setInputValue] = useState(''); // To control the visible input

  interface PasteEvent extends React.ClipboardEvent<HTMLInputElement> {}

  const handlePaste = (e: PasteEvent): void => {
    e.preventDefault(); // Prevent default paste behavior
    const data: string = e.clipboardData.getData('text/plain');
    setPastedContent(data);
    // Clear the visible input
    setInputValue('');
    //let words = data.replace(/\./g, '').split(/\s/);
    let worddata = wordFreq(pastedContent);
    console.log('worddata', worddata);
    //setWordDataArray(wordFreq(data)); 
    setWordDataArray(worddata.filter((w) => !stopWords.toUpperCase().includes(w.text.toUpperCase()))); // Filter out stop words
    console.log('wordDataArray', wordDataArray);

  };

  return (
    <>
      <div>
        <div>

          <input
            type="text"
            style={{ width: '60%', height: '40px', opacity: 20, textAlign: 'center' }} 
            onPaste={handlePaste}
            value={inputValue} // This keeps the input visually empty or controlled
            placeholder="Paste or type text like lyrics here. Text will be hidden."
            onChange={(e) => setInputValue(e.target.value)} // Allows typing if needed
          />

        </div>

     <Wordcloud
        words={wordDataArray}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={'Impact'}
        padding={16}
        spiral={spiralType}
        rotate={withRotation ? getRotationDegree : 0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w:any, i:number) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={'middle'}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size*1}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
      {showControls && (
        <div>
          <label>
            Spiral type &nbsp;
            <select
              onChange={(e) => setSpiralType(e.target.value as SpiralType)}
              value={spiralType}
            >
              
              <option key={'archimedean'} value={'archimedean'}>
                archimedean
              </option>
              <option key={'rectangular'} value={'rectangular'}>
                rectangular
              </option>
            </select>
          </label>
          <label>
            With rotation &nbsp;
            <input
              type="checkbox"
              checked={withRotation}
              onChange={() => setWithRotation(!withRotation)}
            />
          </label>
          
          <br />
        </div>
      )}


     
        {/*     
        <div className="card">
          {pastedContent}
        </div> 
        */}
      
      </div>
    </>
  )
}

export default App
