SECRET_KEY='onlineweeklyreport'
SQLALCHEMY_TRACK_MODIFICATIONS=True
REPORT_DAY=0 #Monday how to change this?
SQLALCHEMY_DATABASE_URI='mysql://super:weeklyreport@10.208.133.197/weeklyreportdev'
SQLALCHEMY_POOL_RECYCLE = 499
SQLALCHEMY_POOL_TIMEOUT = 15
UPLOAD_FOLDER = 'server/upload'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
MAX_CONTENT_LENGTH = 1 * 1024 * 1024