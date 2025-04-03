// Router imports
import AuthRouter from "./routers/AuthRouter";

// Component imports
import Loading from "../../common/components/Loading";

// Hooks imports
import { useSession } from "../../common/hooks/auth/useSession";

export default function Auth() {
    const { session, isLoading } = useSession();
    
    if (isLoading) return <Loading />;

    return <AuthRouter session={session} />;
}
