from fastapi import Depends, HTTPException

from hospital_management_system.utils.auth import get_current_user


def require_role(required_role):

    def role_checker(
        current_user: dict = Depends(get_current_user)
    ):
        if current_user.get("role") != required_role:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this resource"
            )

        return current_user

    return role_checker

def require_roles(*required_roles):

    def role_checker(
        current_user: dict = Depends(get_current_user)
    ):
        if current_user.get("role") not in required_roles:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this resource"
            )

        return current_user

    return role_checker