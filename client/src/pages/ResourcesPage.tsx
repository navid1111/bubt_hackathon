import { useQuery } from "@tanstack/react-query";
import { getAllResources } from "../services/resources-service";

export const ResourcesPage = () => {

    const { data, isLoading } = useQuery({
        queryFn: getAllResources,
        queryKey: ['resources']
    });

    console.log(data);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (<div>
        <h1 className="text-2xl font-bold mb-4">Resources</h1>
        <ul>
            {data.map((resource: any) => (
                <li key={resource.id} className="mb-2 p-4 border border-border rounded-lg bg-card">
                    <h2 className="text-xl font-semibold">{resource.title}</h2>
                    <p className="text-foreground/70">{resource.description}</p>
                    <a href={resource.link} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Learn more</a>
                </li>
            ))}
        </ul>
    </div>);
}