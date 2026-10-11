import { useState, useEffect } from 'react';
import { SimpleEditor } from '~/components/tiptap-templates/simple/simple-editor';
import Button from './button';

interface EditorSectionProps {
    title: string;
    content: string;
    onSave: (content: string) => void;
    variant?: 'default' | 'admin';
}

export default function EditorSection({ title, content, onSave, variant = 'default' }: EditorSectionProps) {
    const [data, setData] = useState(content);

    useEffect(() => {
        setData(content);
    }, [content]);

    console.log("Data content", data)

    const isAdmin = variant === 'admin';

    const containerClasses = isAdmin
        ? "flex flex-col gap-6 p-6 border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)] rounded-xl shadow-sm"
        : "flex flex-col gap-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-800";

    const titleClasses = isAdmin
        ? "text-xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]"
        : "text-xl font-bold text-gray-800";

    const editorWrapperClasses = isAdmin
        ? "border border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)] rounded-lg overflow-hidden flex flex-col bg-transparent"
        : "border border-gray-200 rounded-lg overflow-hidden flex flex-col bg-white";

    return (
        <div className={containerClasses}>
            <div className="flex items-center justify-between">
                <h2 className={titleClasses}>{title}</h2>
            </div>

            <div className={`admin-editor-section ${editorWrapperClasses}`}>
                <SimpleEditor content={data} onChange={setData} />
            </div>

            <div className="flex justify-end pt-2">
                <Button
                    variant="admin-primary"
                    onClick={() => onSave(data)}
                    style={{ width: 'auto', minWidth: '120px' }}
                >
                    Save
                </Button>
            </div>
        </div>
    );
}
