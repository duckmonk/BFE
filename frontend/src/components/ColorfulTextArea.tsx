import { useEffect, useRef, useState } from "react";
import { Box } from '@mui/material';

const trackStringChanges = () => {
    let prevValue = '';
    let cursorPos = 0;
  
    return {
      track: function(newValue: string, cursorPosition: number) {
          console.log('prevValue', prevValue, 'newValue', newValue, 'cursorPosition', cursorPosition);
        cursorPos = cursorPosition;
        const changeType = newValue.length > prevValue.length ? 'insert' : 'delete';
        
        let leftCommon = 0;
        while (leftCommon < prevValue.length && leftCommon < newValue.length 
               && prevValue[leftCommon] === newValue[leftCommon]) {
          leftCommon++;
        }

        // right side
        let rightCommon = 0;
        while (rightCommon < prevValue.length && rightCommon < newValue.length 
               && prevValue[prevValue.length - rightCommon - 1] === newValue[newValue.length - rightCommon - 1]) {
          rightCommon++;
        }
  
        const report = {
          type: changeType,
          position: { leftCommon: leftCommon, rightCommon: rightCommon },
          oldText: prevValue,
          newText: newValue,
        };
  
        prevValue = newValue;
        return report;
      },
      init: function(value: string) {
        prevValue = value;
      }
    };
  };

  interface TextSegment {
    text: string;
    color: string;
    user: string;
  }

const ColorfulTextArea = ({ value, onChange, userType, readOnly }: { value: string; onChange: (value: string) => void; userType: string; readOnly?: boolean }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [segments, setSegments] = useState<TextSegment[]>([]);
    const tracker = useRef(trackStringChanges()).current;
    const isFirstRender = useRef(true);
  
    useEffect(() => {
      if (isFirstRender.current && value) {
        try {
          const parsedSegments = JSON.parse(value);
          setSegments(parsedSegments);
          tracker.init(parsedSegments.map((s: TextSegment) => s.text).join(''));
          isFirstRender.current = false;
        } catch {
          const defaultSegment = [{ text: value, color: '#000000', user: userType }];
          setSegments(defaultSegment);
          tracker.init(value);
          isFirstRender.current = false;
        }
      }
    }, [value, userType]);
  
    const updateSegments = (changeReport: any) => {
      console.log('changeReport', changeReport);
      console.log('old segments', segments);
      const color = userType === 'admin' ? '#d32f2f' : '#000000';
      
      const newSegments = [];
      const newTextDiff = changeReport.newText.length - changeReport.position.leftCommon - changeReport.position.rightCommon;
      for (let i = 0; i < changeReport.position.leftCommon; i++) {
        newSegments.push(segments[i]);
      }
      for (let i = changeReport.position.leftCommon; i < changeReport.position.leftCommon + newTextDiff; i++) {
        newSegments.push({ text: changeReport.newText[i], color, user: userType });
      }
      for (let i = changeReport.oldText.length - changeReport.position.rightCommon; i < changeReport.oldText.length; i++) {
        newSegments.push(segments[i]);
      }
      console.log('newSegments', newSegments);
      setSegments(newSegments);
      onChange(JSON.stringify(newSegments));
    };
  
    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      console.log('segments before handleInput', segments);
      const newText = e.currentTarget.value;
      const cursorPosition = e.currentTarget.selectionStart || 0;
      
      const changeReport = tracker.track(newText, cursorPosition);
      
      updateSegments(changeReport);
    };
  
    return (
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            p: 1,
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            overflow: 'hidden',
            fontFeatureSettings: '"liga" 0, "calt" 0',
            letterSpacing: 'normal',
            wordSpacing: 'normal'
          }}
        >
          {segments.map((segment, index) => (
            <span key={index} style={{ color: segment.color }}>
              {segment.text}
            </span>
          ))}
        </Box>
        <textarea
          ref={textareaRef}
          value={segments.map(s => s.text).join('')}
          onInput={handleInput}
          readOnly={readOnly}
          style={{
            width: '100%',
            minHeight: '150px',
            padding: '8px',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            color: 'transparent',
            caretColor: userType === 'admin' ? '#d32f2f' : '#000000',
            resize: 'vertical',
            fontFeatureSettings: '"liga" 0, "calt" 0',
            letterSpacing: 'normal',
            wordSpacing: 'normal',
            tabSize: 4,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          }}
        />
      </Box>
    );
  };

export default ColorfulTextArea;