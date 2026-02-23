import Layout from '../components/Layout.jsx';

function CodeBlock({ children }) {
    return (
        <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-xs overflow-x-auto my-3 font-mono">
            {children}
        </pre>
    );
}

function Section({ title, children }) {
    return (
        <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">{title}</h2>
            {children}
        </div>
    );
}

function DocsPage() {
    return (
        <Layout>
            <div className="max-w-4xl">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h1 className="text-2xl font-bold text-blue-600 mb-2">Technical Documentation</h1>
                    <p className="text-gray-500 text-sm mb-8">Author: Nash Anuwar</p>

                    <Section title="Overview">
                        <p className="text-gray-700 text-sm leading-relaxed">
                            App overview description
                        </p>
                    </Section>

                    <Section title="Stack">
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li><strong>Frontend:</strong> text here</li>
                            <li><strong>Backend:</strong> text here</li>
                            <li><strong>Database:</strong> text here</li>
                            <li><strong>Auth:</strong> text here </li>
                        </ul>
                    </Section>

                    <Section title="Why Auth0 Alone Is Not Always OIDC">
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            explanation
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            Text <code className="bg-gray-100 px-1 rounded">code</code> textttt
                        </p>
                        <p className="text-gray-700 text-sm font-medium mb-1">title</p>
                        <CodeBlock>{`insert code block here 
>`}</CodeBlock>
                        <p className="text-gray-700 text-sm font-medium mb-1">title:</p>
                        <CodeBlock>{`insert code block here 
`}</CodeBlock>
                        <p className="text-gray-700 text-sm leading-relaxed mt-3">
                            insert text here
                        </p>
                    </Section>

                    <Section title="title">
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            insert text here
                        </p>
                        <CodeBlock>{`
        insert code block here`}</CodeBlock>
                    </Section>

                    <Section title="title">
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            description <code className="bg-gray-100 px-1 rounded">/.EXAMPLE OF CODE TEXT</code>.
                            description
                        </p>
                        <CodeBlock>{`codeblock`}</CodeBlock>
                    </Section>

                    <Section title="header">
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            text
                        </p>
                        <CodeBlock>{`codeblock`}</CodeBlock>
                        <p className="text-gray-700 text-sm leading-relaxed mt-3">
                            Text
                        </p>
                    </Section>

                    <Section title="header">
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            Text
                        </p>
                        <CodeBlock>{`codeblock`}</CodeBlock>
                    </Section>
                </div>
            </div>
        </Layout>
    );
}

export default DocsPage;

