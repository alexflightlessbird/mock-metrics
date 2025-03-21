import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useSession } from "../hooks/auth/useSession";
import { setDocumentTitle } from "../utils/helpers";
import Modal from "../components/paginating-forms/Modal";

export default function UserSettings () {
    const { userId } = useSession();

    return (
        <div>
            <h1>Settings Page</h1>
        </div>
    );
}