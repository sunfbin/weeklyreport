from server import app


def start_app(host="0.0.0.0", port="8080"):
    app.run(host, port)


if __name__ == "__main__":
    start_app()
