class ErrorWithCode(Exception):
    def __init__(self, code: int) -> None:
        self.code = code

    def __str__(self):
        return repr(self.code)
