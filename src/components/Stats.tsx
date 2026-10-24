import { crew } from '@/data/members'

export default function Stats() {
    const stats: [string | number, string][] = [[crew.length, 'members'], [4, 'focus domains'], [0, 'deadlines'], [0, 'restrictions']]
    return (
        <div className="stats">
            {stats.map(([n, label]) => (
                <div key={label}><b>{n}</b><span>{label}</span></div>
            ))}
        </div>
    )
}
