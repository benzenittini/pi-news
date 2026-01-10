import './App.css'

type Props = {
  date: string;
};

function TopStories({ date }: Props) {
  return (
    <div>
      <div style={{
        fontSize: '64px',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: '0.2em',
        marginTop: '50px',
        marginBottom: '10px',
      }}>WOW A NEWSPAPER</div>

      <div style={{
        borderTop: '1px solid var(--line-gray)',
        borderBottom: '1px solid var(--line-gray)',
        display: 'flex',
        justifyContent: 'space-between',
        fontStyle: 'italic',
      }}>
        <span>AI Generated Slop</span>
        <span>Developed by Ben Zenittini</span>
        <span>{date}</span>
      </div>
    </div>
  );
}

export default TopStories
