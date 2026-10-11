function getRelativeTime(dateString: string) {
    if (!dateString) return '';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    if (isNaN(diffMs) || diffMs < 0) return 'just now';

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
}

export default function NewUsersList({ users }: { users?: any[] }) {
    const dummyUsers = [
        {
            name: 'Adebayo Okoro',
            role: 'Reader',
            time: '2h ago',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdrZL6vsyyX6xlmdP7dF9zlNNaWL774IOXMvTgpkvUrKNceBolUktZ9cVkUGhpKWwy8NmdNKxrJ2l2MSOGKdO7V1j5V46EYepXeoH4jp6-9ICS7H8oWR9Vt0c711yIk0pNxxSeGSZrc0fJ_VRmokcUO3wVoffZhPTysZviQiVeNgpIrj9fLRdlhbHV14rVXVIiOGzpelrSujAUlItCLJrrjN52EPjtTLZu_bjJ7Km7_RTM_Uztgix-him3YaBRx9PoBXO4zbS2-gM',
        },
        {
            name: 'Nia Kimani',
            role: 'Contributor',
            time: '1d ago',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVyQHRgbDRLVBn-43XQ5XSUQXnC6o09sX6CWL7x_kJOBzKP03y1rOR_jrpO-5iDGwcVJiVho3Qh-JH4il8YPeJ1BvpF7hJsOdmkzY3PvamoqHyUL2vjg0Q6xv0rhhEM090L5b1JwDaEBvsF4ESowi3HLhFC1DNQboEg9rvIvWLjr4t0YVU_E6cvP_bc_sjW0hje8kmJrVieakYmdsB-GwbXNk-lGCt16H5yawQeNQ1goz16nFEW8RuyBXTAPrnN3sPn7CRcPto6Fg',
        },
        {
            name: 'Kwame Mensah',
            role: 'Reader',
            time: '3d ago',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgwzWG3eQWVgELKaXsJN4-5vuoQlmB2TAv1ISl5CEHSFD7r7WDXhjo6PMR226dwWNQ-JQ2SdJyzcIFf3QHzb9VHh97PGwE9A4FqJl_o1_Jtgn6G2E8CKWVI3vFj8xHBmsYZ73i-Co7iCwW9RKcFKnrbuLkRq8vqcdDWthXFGPLerC_NqqM5zryA72Eq2lFijRQyYygFCJTAzqV7CCsK9Fj8XLJvgYFYs-j5Eq6HlhzRNIZCb0pwF4JpeG55-DsJe3pvwIJ8eSZzXQ',
        },
    ]

    const hasUsers = users && users.length > 0;
    const displayUsers = hasUsers
        ? users.map((u: any) => {
              const firstName = u.profile?.firstName || '';
              const lastName = u.profile?.lastName || '';
              const fullName = `${firstName} ${lastName}`.trim() || u.email || 'Anonymous User';
              const roleName = u.metadata?.role?.name || 'Reader';
              const roleFormatted = roleName.charAt(0).toUpperCase() + roleName.slice(1);
              const avatar = u.profile?.profilePicture || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgwzWG3eQWVgELKaXsJN4-5vuoQlmB2TAv1ISl5CEHSFD7r7WDXhjo6PMR226dwWNQ-JQ2SdJyzcIFf3QHzb9VHh97PGwE9A4FqJl_o1_Jtgn6G2E8CKWVI3vFj8xHBmsYZ73i-Co7iCwW9RKcFKnrbuLkRq8vqcdDWthXFGPLerC_NqqM5zryA72Eq2lFijRQyYygFCJTAzqV7CCsK9Fj8XLJvgYFYs-j5Eq6HlhzRNIZCb0pwF4JpeG55-DsJe3pvwIJ8eSZzXQ';
              const time = getRelativeTime(u.createdAt || u.created_at);

              return {
                  name: fullName,
                  role: roleFormatted,
                  avatar: avatar,
                  time: time
              };
          })
        : dummyUsers;

    return (
        <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
            <h2 className="font-display border-b border-[var(--color-admin-border-light)] px-6 py-4 text-xl font-bold text-[var(--color-admin-text-primary-light)] dark:border-[var(--color-admin-border-dark)] dark:text-[var(--color-admin-text-primary-dark)]">
                New Users
            </h2>
            <ul className="divide-y divide-[var(--color-admin-border-light)] p-2 dark:divide-[var(--color-admin-border-dark)]">
                {displayUsers.map((user) => (
                    <li
                        key={user.name + user.time}
                        className="flex items-center justify-between p-4"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="aspect-square size-10 rounded-full bg-cover bg-center bg-no-repeat"
                                data-alt="User avatar"
                                style={{
                                    backgroundImage: `url('${user.avatar}')`,
                                }}
                            ></div>
                            <div>
                                <p className="text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                    {user.name}
                                </p>
                                <p className="text-xs text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                    {user.role}
                                </p>
                            </div>
                        </div>
                        <span className="text-xs text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)] whitespace-nowrap">
                            {user.time}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
