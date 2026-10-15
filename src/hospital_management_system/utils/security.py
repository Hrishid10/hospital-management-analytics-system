import bcrypt


def hash_password(password):
    password = password.encode("utf-8")

    salt = bcrypt.gensalt()

    hashed_password = bcrypt.hashpw(password, salt)

    return hashed_password.decode("utf-8")


def verify_password(password, password_hash):
    password = password.encode("utf-8")
    password_hash = password_hash.encode("utf-8")

    return bcrypt.checkpw(password, password_hash)