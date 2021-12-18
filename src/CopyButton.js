import React from 'react';
import {copyToClipboard} from './util';

export default function CopyButton(props) {
    return (
        <button className='copy-btn' onClick={e => {
            copyToClipboard(document.getElementById(props.sourceId));
            const btn = e.currentTarget;
            const oldText = btn.innerText;
            btn.innerText = 'Copied!';
            setTimeout(() => {
                btn.innerText = oldText;
            }, 1000);
        }}>Copy to clipboard</button>
    );
}
