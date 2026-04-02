## backend api design
-- success with data
{
    "success": true,
    "message": "contact request submitted successfully.",
    "data": {
        "id": 4,
        "submitted_at": "2026-04-02t01:34:13.044z"
    },
    "error": null
}

-- success without data
{
    "success": true,
    "message": "contact request submitted successfully.",
    "data": null,
    "error": null
}

-- failed with validations error
{
    "success": false,
    "message": "Please correct the highlighted fields.",
    "data": null,
    "error": {
        "full_name": "Full name must be at least 2 characters.",
        "email": "Enter a valid email address."
    }
}

-- general failed
{
    "success": false,
    "message": "server error!",
    "data": null,
    "error": {
        "message": "failed message detail."
    }
}
