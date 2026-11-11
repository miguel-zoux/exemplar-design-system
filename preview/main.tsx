import * as React from 'react';
import { createRoot } from 'react-dom/client';
import * as DS from '../src';

const tokenNames = () => Array.from(document.styleSheets)
  .flatMap((sheet) => Array.from(sheet.cssRules))
  .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText === '.wgu-ds')
  .flatMap((rule) => Array.from(rule.style).filter((name) => name.startsWith('--wgu-')));

function Preview() {
  const [tokens, setTokens] = React.useState<string[]>([]);
  React.useEffect(() => setTokens(tokenNames()), []);
  return (
    <div className="wgu-ds" style={{ padding: 32, display: 'grid', gap: 32 }}>
      <DS.LaunchCard
        name="Flashcards"
        title="Retrieval Practice"
        body="Hi! 👋 Let's pause for a quick review. You'll see a term, try to remember what it means, before revealing the answer."
        actionLabel="Launch Interactive"
        onLaunch={() => undefined}
      />
      <div style={{ height: 400, borderRadius: 24, overflow: 'hidden' }}>
        <DS.InteractiveShell
          name="Flashcards"
          actions={(
            <>
              <DS.IconButton label="Start again"><DS.ReplayIcon /></DS.IconButton>
              <DS.IconButton label="Close"><DS.CloseIcon /></DS.IconButton>
            </>
          )}
        >
          <div style={{ display: 'flex', gap: 16, padding: 32, flexWrap: 'wrap', alignItems: 'center' }}>
            <DS.Button>Primary</DS.Button>
            <DS.Button variant="secondary" icon={<DS.ReplayIcon width={24} height={24} />}>Secondary</DS.Button>
            <DS.Card style={{ padding: 24 }}>
              <p className="wgu-type-h4" style={{ color: 'var(--wgu-txt-headings)' }}>H4 heading</p>
              <p className="wgu-type-body-20-regular">Body 20 regular</p>
            </DS.Card>
          </div>
        </DS.InteractiveShell>
      </div>
      <div style={{ background: 'white', borderRadius: 16, padding: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
        {tokens.map((name) => (
          <div key={name} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
            <span style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid #ccc', background: `var(${name})` }} />
            <code>{name}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Preview />);
